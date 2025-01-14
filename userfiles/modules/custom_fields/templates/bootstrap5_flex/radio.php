<div class="col-sm-<?php echo $settings['field_size_mobile']; ?> col-md-<?php echo $settings['field_size_tablet']; ?> col-lg-<?php echo $settings['field_size_desktop']; ?>">
    <div class="mb-3 d-flex">

        <?php if ($settings['show_label']): ?>
            <label class="form-label me-2 align-self-center mb-0">
                <?php echo $data['name']; ?>
                <?php if ($settings['required']): ?>
                    <span style="color: red;">*</span>
                <?php endif; ?>
            </label>
        <?php endif; ?>

        <?php
        $i = 0;
        foreach ($data['values'] as $key => $value):
            $i++;
            ?>
            <div class="custom-control custom-radio my-2">
                <input type="radio" id="custom-radio-<?php echo $data['id'] . '-' . $key; ?>" class="form-check-input" <?php if ($settings['required'] && $i == 1): ?>required<?php endif; ?> data-custom-field-id="<?php echo $data['id']; ?>" value="<?php echo $value; ?>"
                       name="<?php echo $data['name_key']; ?>">
                <label class="custom-control-label ms-2" for="custom-radio-<?php echo $data['id'] . '-' . $key; ?>"><?php echo $value; ?></label>
            </div>
        <?php endforeach; ?>

        <?php if ($data['help']): ?>
            <small class="form-text text-muted"><?php echo $data['help']; ?></small>
        <?php endif; ?>

    </div>
</div>
